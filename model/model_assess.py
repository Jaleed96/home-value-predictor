import numpy as np
import pandas as pd
from sklearn.linear_model import Lasso
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

data = pd.read_csv("train_data.csv")

data_X = data.drop('PRICE_PER_SQRMETER', axis='columns', inplace=False)
data_X = pd.get_dummies(data_X, dummy_na=True)

ss = StandardScaler()
X = ss.fit_transform(data_X)

y = data.loc[:, ['PRICE_PER_SQRMETER']].values


X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, shuffle=False
)

clf = Lasso(alpha=(10**1.25))
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
print('Mean Absolute Error = ', mae)
print('Coefficient of Determination = ', clf.score(X_test, y_test))

print("\ntop 10 feature: ")
feature_rank = np.flip(np.argsort(clf.coef_))
for i in range(10):
    print(data_X.columns[feature_rank[i]], ":", clf.coef_[feature_rank[i]])
