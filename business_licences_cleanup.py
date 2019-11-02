import pandas as pd
import numpy as np
import random
import math
import json

data = pd.read_csv("./datasets/business-licences.csv", sep=";")

geom_col = data.loc[:, 'Geom']
latitudes = []
longitudes = []

for item in geom_col:
    if type(item) != float:
        point_dict = json.loads(item)
        latitudes.append(point_dict['coordinates'][0])
        longitudes.append(point_dict['coordinates'][1])
    else:
        latitudes.append(None)
        longitudes.append(None)

data['Latitude'] = latitudes
data['Longitude'] = longitudes

data.to_csv('./datasets/business-licences-geo.csv', index=None, header=True)