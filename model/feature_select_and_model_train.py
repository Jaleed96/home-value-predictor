import numpy as np
import pandas as pd
from sklearn.linear_model import Lasso, Ridge, LinearRegression
from sklearn.preprocessing import StandardScaler
from joblib import dump, load
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import train_test_split

data = pd.read_csv("train_data.csv")

data_X = data.drop('PRICE_PER_SQRMETER', axis='columns', inplace=False)
data_X = pd.get_dummies(data_X, dummy_na=True)
columns = data_X.columns


ss = StandardScaler()
X = ss.fit_transform(data_X)

y = data.loc[:, ['PRICE_PER_SQRMETER']].values

clf = Lasso(alpha=(10**1.25))
clf.fit(X, y)


print("\nfeature select: ")
feature_rank = np.flip(np.argsort(abs(clf.coef_)))

for i in range(65, len(feature_rank)):

    data_X = data_X.drop(columns[feature_rank[i]],
                         axis='columns', inplace=False)

for col in data_X.columns:
    print(col + ",<br />")

X = ss.fit_transform(data_X)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, shuffle=False
)

#clf = load('model.joblib')
clf = Lasso(alpha=(10**1.25))
clf.fit(X_train, y_train)
dump(clf, 'model.joblib')
y_pred = clf.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)
print('Mean Absolute Error = ', mae)
print('Coefficient of Determination = ', clf.score(X_test, y_test))
