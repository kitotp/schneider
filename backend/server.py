from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from sklearn.model_selection import train_test_split
from torch.utils.data import TensorDataset, DataLoader
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LimeResult(BaseModel):
    feature_names: list[str]
    mean_contrib: list[float]
    n_samples_used: int


@app.post("/analyze-dataset")
async def analyze_dataset(file: UploadFile = File(...)):

    df = pd.read_csv(file.file)

    if "id" in df.columns:
        df = df.drop(columns=["id"])

    X = df.iloc[:, :-1].to_numpy()
    y = df.iloc[:, -1].to_numpy()

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

    knn = KNeighborsClassifier(n_neighbors=3, weights="distance", metric="minkowski")
    knn.fit(X_train, y_train)
    y_pred_knn = knn.predict(X_test)

    acc = accuracy_score(y_test, y_pred_knn)
    print("kNN accuracy:", acc)

    return {"accuracy": acc}
