import pandas as pd
import numpy as np
import random
import math
import geopy.distance

test_house_lat = 49.263591
test_house_long = -123.063178

CRIME_RADIUS = 0.5
BUSINESS_RADIUS = 0.5

crime_data = pd.read_csv("./datasets/crime-data-clean.csv")
business_data = pd.read_csv("./datasets/business-licences-clean.csv")

def calculate_dist(coord_from, coord_to):
    return geopy.distance.vincenty(coord_from, coord_to).km

def get_crimes_in_vicinity(property_coord, year):
    crime_freq = {}
    crime_cols = ["TYPE_Break and Enter Commercial", "TYPE_Break and Enter Residential/Other", \
     "TYPE_Mischief", "TYPE_Other Theft", "TYPE_Theft from Vehicle", "TYPE_Theft of Bicycle", "TYPE_Theft of Vehicle", "TYPE_Vehicle Collision or Pedestrian Struck (with Fatality)", "TYPE_Vehicle Collision or Pedestrian Struck (with Injury)"]

    for i in range(len(crime_data)):
        for j in range(len(crime_cols)):
            cur_sample = crime_data.iloc[i]
            if int(cur_sample["YEAR"]) <= year and calculate_dist(property_coord, (cur_sample["LATITUDE"], cur_sample["LONGITUDE"])) <= CRIME_RADIUS:
                if crime_cols[j] in crime_freq:
                    crime_freq[crime_cols[j]] += cur_sample[crime_cols[j]]
                else:
                    crime_freq[crime_cols[j]] = cur_sample[crime_cols[j]]
    
    return crime_freq

def get_businesses_in_vicinity(property_coord, year):
    business_freq = {}
    business_cols = []

    for col in business_data.columns:
        if col.startswith("BusinessType"):
            business_cols.append(col)
    
    for i in range(len(business_data)):
        for j in range(len(business_cols)):
            cur_sample = business_data.iloc[i]
            distance_from_property = calculate_dist(property_coord, (cur_sample["Latitude"], cur_sample["Longitude"]))
            
            if int(cur_sample["IssuedYear"]) <= year and int(cur_sample["ExpiryYear"]) >= year and distance_from_property <= BUSINESS_RADIUS:
                if business_cols[j] in business_freq:
                    business_freq[business_cols[j]] += cur_sample[business_cols[j]]
                else:
                    business_freq[business_cols[j]] = cur_sample[business_cols[j]]
    return business_freq
#print(get_crimes_in_vicinity((test_house_lat, test_house_long), 2018))

print(get_businesses_in_vicinity((test_house_lat, test_house_long), 2014))