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
# print("Converting UTM format to lat/long...")

# utm_xy = data[["X", "Y"]]
# myProj = Proj("+proj=utm +zone=10K, +north +ellps=WGS84 +datum=WGS84 +units=m +no_defs")

# longitudes, latitudes = myProj(utmxy['X'].values, utmxy['Y'].values, inverse=True)

# for i in range(len(longitudes)):
#     print(longitudes[i], latitudes[i])

# One Hot encoding categorical data
print("One Hot encoding categorical data...")

block_names = []
hundred_block_col = data.loc[:, "HUNDRED_BLOCK"]

for item in hundred_block_col:
    block_names.append(" ".join(item.split(" ")[1:]))

data.drop(columns=["HUNDRED_BLOCK"], inplace=True)
data["BLOCK"] = block_names

categorical_feats = ["TYPE", "BLOCK", "NEIGHBOURHOOD"]
data = pd.get_dummies(data, columns=categorical_feats, prefix=categorical_feats)

data.to_csv("./datasets/crime-data-clean.csv", index=None, header=True)