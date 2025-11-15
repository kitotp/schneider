from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score
from lime.lime_tabular import LimeTabularExplainer
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


knn_model = None
X_train_global = None
X_test_global = None
feature_names_global = None


class LimeResult(BaseModel):
    feature_names: list[str]
    mean_contrib: list[float]
    n_samples_used: int


def get_feature_name(desc, feature_names):
    tokens = desc.replace("<", " ").replace(">", " ").replace("=", " ").split()
    for token in tokens:
        if token in feature_names:
            return token
    return None


@app.post("/analyze-dataset")
async def analyze_dataset(file: UploadFile = File(...)):
    global knn_model, X_train_global, X_test_global, feature_names_global

    df = pd.read_csv(file.file)

    if "id" in df.columns:
        df = df.drop(columns=["id"])

    X = df.iloc[:, :-1].to_numpy()
    y = df.iloc[:, -1].to_numpy()

    feature_names_global = df.columns[:-1].tolist()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    X_train_global = X_train
    X_test_global = X_test

    knn = KNeighborsClassifier(n_neighbors=3, weights="distance", metric="minkowski")
    knn.fit(X_train, y_train)
    y_pred = knn.predict(X_test)
    acc = accuracy_score(y_test, y_pred)

    knn_model = knn

    return {"accuracy": acc}


@app.post("/analyze-probabilities")
async def analyze_probabilities():
    global knn_model, X_train_global, X_test_global, feature_names_global

    if knn_model is None:
        return {"error": "You must call /analyze-dataset first!"}
    X_train = X_train_global
    X_test = X_test_global
    feature_names = feature_names_global
    N = 10
    num_features = len(feature_names)
    class_names = ["class_0", "class_1"]

    explainer = LimeTabularExplainer(
        X_train,
        feature_names=feature_names,
        class_names=class_names,
        discretize_continuous=True,
        mode="classification",
    )

    sum_contrib = np.zeros(num_features)
    count_contrib = np.zeros(num_features)

    for i in range(N):
        exp = explainer.explain_instance(
            X_test[i],
            knn_model.predict_proba,
            num_features=num_features,
        )

        for desc, weight in exp.as_list():
            fname = get_feature_name(desc, feature_names)
            if fname is None:
                continue

            idx = feature_names.index(fname)
            sum_contrib[idx] += weight
            count_contrib[idx] += 1

    mean_contrib = sum_contrib / np.maximum(count_contrib, 1)

    return {
        "feature_names": feature_names,
        "mean_contrib": mean_contrib.tolist(),
        "n_samples_used": int(N),
    }


@app.post('/gpt-analyze')
def analyze_gpt():
    