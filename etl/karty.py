import sys
from clickhouse_driver import Client
from datetime import datetime
import glob

client = Client.from_url('clickhouse://default:kolomolo1234@localhost:9000/default')
def cleanData(row):
    try: 
        hour = row[6].split("(")[1].split(")")[0]
    except IndexError:
        hour = "00:00"
    event_date = datetime.strptime(row[1]+" "+hour,"%Y-%m-%d %H:%M")
    card_number = row[2]
    busFrom = row[7]
    busTo = row[8]    
    journeyType = row[10]
    return ({'EventDate' : event_date,'CardNumber' : card_number,'busstopFrom' : busFrom,'busstopTo' :busTo,'passingType' :journeyType})
def loadJourneys(filename):
    file1 = open("data/karty/od01do07wrzesnia2021.csv","r",encoding="cp1250")
    lines = file1.readlines()
    output = []
    for line in lines:
        temp = line.strip().split(";")
        output.append(cleanData(temp))
    client.execute('INSERT INTO journeys (EventDate,CardNumber,busstopFrom,busstopTo,passingType) VALUES', output)

filesToLoad = glob.glob("data/karty/*.csv")
for fileToLoad in filesToLoad:
    loadJourneys(fileToLoad)