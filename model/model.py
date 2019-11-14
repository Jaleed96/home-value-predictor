import numpy as np
import pandas as pd
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split
from joblib import dump, load

data = pd.read_csv("input.csv")
clf = load("model.joblib")
y_pred = clf.predict(data)
print(y_pred[0][0])
