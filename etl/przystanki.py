import sys
import mysql.connector as mysql
db = mysql.connect(
    host = "localhost",
    user = "root",
    passwd = "kolomolo1234",
    database = "mobilitytracker"
)
cursor = db.cursor()
def insert(what):
    query = "INSERT INTO przystanki (lat,lng,shortname,name,district) VALUES (%s,%s,%s,%s,%s);"
    cursor.execute(query,what)
def dms_to_dd(d, m, s):
    dd = float(d) + float(m)/60 + float(s)/3600
    return str(dd)
def cleanData(row):
    ddlat = row[19].split(",")
    ddlng = row[20].split(",")
    lat = dms_to_dd(ddlat[0],ddlat[1],ddlat[2])
    lng = dms_to_dd(ddlng[0],ddlng[1],ddlng[2])
    return (lat,lng,row[26],row[2],row[34])
file1 = open("data/przystanki.csv","r",encoding="cp1250")
lines = file1.readlines()
output = set()
for line in lines:
    temp = line.strip().split(";")
    if (len(temp)==47):
        if (temp[0].isnumeric()):
            output.add(cleanData(temp))
            #cleanData(temp)
for przystanek in output:
    insert(przystanek)
db.commit()
sys.exit(0)
