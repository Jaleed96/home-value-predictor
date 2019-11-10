import pandas as pd
import numpy as np
import random
import math
import geopy.distance
import json

CRIME_RADIUS = 0.5
BUSINESS_RADIUS = 0.5

crime_data = pd.read_csv("./datasets/crime-data-clean.csv")
business_data = pd.read_csv("./datasets/business-licences-clean.csv")

def calculate_dist(coord_from, coord_to):
    return geopy.distance.vincenty(coord_from, coord_to).km

def get_crimes_in_vicinity(property_coord, year):
    crime_freq = []
    crime_cols = []

    for col in crime_data.columns:
        if col.startswith("TYPE"):
            crime_cols.append(col)
            crime_freq.append(0)

    for i in range(len(crime_data)):
        for j in range(len(crime_cols)):
            cur_sample = crime_data.iloc[i]
            if int(cur_sample["YEAR"]) <= year and calculate_dist(property_coord, (cur_sample["LATITUDE"], cur_sample["LONGITUDE"])) <= CRIME_RADIUS:
               crime_freq[j] += cur_sample[crime_cols[j]]
    
    return crime_freq

def get_businesses_in_vicinity(property_coord, year):
    business_freq = []
    business_cols = []

    for col in business_data.columns:
        if col.startswith("BusinessType"):
            business_cols.append(col)
            business_freq.append(0)
            
    for i in range(len(business_data)):
        for j in range(len(business_cols)):
            cur_sample = business_data.iloc[i]
            distance_from_property = calculate_dist(property_coord, (cur_sample["Latitude"], cur_sample["Longitude"]))
            
            if int(cur_sample["IssuedYear"]) <= year and int(cur_sample["ExpiryYear"]) >= year and distance_from_property <= BUSINESS_RADIUS:
               business_freq[j] += cur_sample[business_cols[j]]

    return business_freq

property_data = pd.read_csv("./datasets/coord-price-geom.csv")
business_frequency = []
crime_frequency = []


for i in range(len(property_data)):
    cur_sample = property_data.iloc[i]
    cur_geom = cur_sample["POLYGON_CENTROID"][5:].split(" ")

    lat = float(cur_geom[1][:-1])
    long = float(cur_geom[0][1:])

    nearby_businesses = get_businesses_in_vicinity((lat, long), int(cur_sample["REPORT_YEAR"]))
    nearby_crime = get_crimes_in_vicinity((lat, long), int(cur_sample["REPORT_YEAR"]))

    business_frequency.append(nearby_businesses)
    crime_frequency.append(nearby_crime)

p = 0
for col in crime_data.columns:
    if col.startswith("TYPE"):
        cur_col = []
        for j in range(len(crime_frequency)):
            cur_col.append(crime_frequency[j][p])
        p += 1
        property_data[col] = cur_col

p = 0
for col in business_data.columns:
    if col.startswith("BusinessType"):
        cur_col = []
        for j in range(len(business_frequency)):
            cur_col.append(business_frequency[j][p])
        p += 1
        property_data[col] = cur_col

property_data.drop(columns=["POLYGON_CENTROID"], inplace=True)

property_data.to_csv("./datasets/test.csv", index=None, header=True)