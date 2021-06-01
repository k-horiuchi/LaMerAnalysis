import json
import datetime
with open('program/data.json', 'r', encoding='UTF-8') as f:
    data = json.load(f)

time_list = []
for row in data:
    for time in row:
        time_list.append(time)

time_table = sorted(set(time_list))
cast_list = ["恋摘いちご","練みるく","水葉しずく","野々ののこ","花陽ここあ","華城ヨミ","枢けい","桃園えりか"]
dict_cast_time = {}

for time in time_table:
    value_text = ""
    count = -1
    for cast in cast_list:
        count += 1
        if time in data[count]:
            value_text += cast + " "
    dict_cast_time[time] = value_text

with open('result.html', 'w') as html:
    for k, v in dict_cast_time.items():
        key = datetime.datetime.fromtimestamp(int(k)).strftime('%m月%d日 %H時%M分')
        print(key, " : ", v)
        html.write("<p>"+key+" : "+v+"</p>")