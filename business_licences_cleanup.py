import pandas as pd
import numpy as np
import random
import math
import json
import datetime

data = pd.read_csv("./datasets/business-licences.csv", sep=";")

# Converting Geom to individual lat/long

print("Converting Geom to lat/long...")

geom_col = data.loc[:, "Geom"]
latitudes = []
longitudes = []

for item in geom_col:
    if type(item) != float:
        point_dict = json.loads(item)
        latitudes.append(point_dict["coordinates"][0])
        longitudes.append(point_dict["coordinates"][1])
    else:
        latitudes.append(None)
        longitudes.append(None)

data["Latitude"] = latitudes
data["Longitude"] = longitudes


# Removing null entries
non_null_cols = ["Latitude", "Longitude", "IssuedDate", "ExpiryDate", "ExtractDate", "BusinessType", "BusinessSubType", "UnitType", "LocalArea"]
samples_to_remove = []

for i in range(data.shape[0]):
    cur_sample = data.iloc[i]
    for j in range(len(non_null_cols)):
        if type(cur_sample[non_null_cols[j]]) == float and math.isnan(cur_sample[non_null_cols[j]]):
            samples_to_remove.append(i)

data.drop(samples_to_remove, inplace=True)

# Normalizing dated cols to year only
print("Standardizing datetime/dates to year only...")

date_cols = data[["IssuedDate", "ExtractDate", "ExpiryDate"]]
updated_issued_dates = []
updated_extract_dates = []
updated_expiry_dates = []

for i in range(len(date_cols)):
    cur_iss_date = date_cols.iloc[i]["IssuedDate"]
    cur_ext_date = date_cols.iloc[i]["ExtractDate"]
    cur_exp_date = date_cols.iloc[i]["ExpiryDate"]
    
    if type(cur_iss_date) != float:
        updated_issued_dates.append(cur_iss_date[:4])
    else:
        updated_issued_dates.append(None)
    
    if type(cur_exp_date) != float:
        updated_expiry_dates.append(cur_exp_date[:4])
    else:
        updated_expiry_dates.append(None)

    if type(cur_ext_date) != float:
        updated_extract_dates.append(cur_ext_date[:4])
    else:
        updated_extract_dates.append(None)

data["IssuedYear"] = updated_issued_dates
data["ExpiryYear"] = updated_expiry_dates
data["ExtractYear"] = updated_extract_dates

# One Hot encoding categorical features
print("One Hot encoding categorical features...")

categorical_feats = ["BusinessType", "BusinessSubType", "UnitType", "LocalArea"]
data = pd.get_dummies(data, columns=categorical_feats, prefix=categorical_feats)

# Dropping extraneous cols
print("Dropping unimportant cols...")

data.drop(columns=["Geom", "BusinessName", "BusinessTradeName", "Unit", "House", "City", "Province", "Country", "PostalCode", "IssuedDate", "ExtractDate", "ExpiryDate"], inplace=True)


data.to_csv("./datasets/business-licences-clean.csv", index=None, header=True)