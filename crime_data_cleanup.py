import pandas as pd
import numpy as np
import random
import math
#from pyproj import Proj

data = pd.read_csv("./datasets/crimedata_csv_all_years.csv")

# Drop null entries
print("Dropping null records...")
data.dropna(axis=0, how='any', inplace=True)

# Convert UTM to lat/long
print("Converting UTM format to lat/long...")

utm_xy = data[["X", "Y"]]
myProj = Proj("+proj=utm +zone=10K, +north +ellps=WGS84 +datum=WGS84 +units=m +no_defs")

longitudes, latitudes = myProj(utm_xy['X'].values, utm_xy['Y'].values, inverse=True)

data.drop(columns=["X", "Y"], inplace=True)
data["LATITUDE"] = latitudes
data["LONGITUDE"] = longitudes

# One Hot encoding categorical data
print("One Hot encoding categorical data...")


data.drop(columns=["HUNDRED_BLOCK"], inplace=True)

categorical_feats = ["TYPE", "NEIGHBOURHOOD"]
data = pd.get_dummies(data, columns=categorical_feats, prefix=categorical_feats)

data.to_csv("./datasets/crime-data-clean.csv", index=None, header=True)