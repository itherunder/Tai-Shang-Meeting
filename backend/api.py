from flask import Flask, request
from flask_cors import cross_origin

app = Flask(__name__)

whitelist = {
    "0x2913825f11434a5070797d32df3a892e28d891a0": {
        "url": "https://meeting.tencent.com/dm/Jlt67cFSWV0Q",
        "name": "test",
        "password": "123456",
        "status": "finished",
        "period": "2022-04-22 20:00 ~ 2022-04-22 21:00",
        "hoster": "Lee Duck Go",
        "description": "for test",
    },
    "0x3bb53e81d7b9bd6369ad84d7289b2b42fb486120": {
        "url": "https://meeting.tencent.com/dm/Jlt67cFSWV0Q",
        "name": "test",
        "password": "123456",
        "status": "finished",
        "period": "2022-04-22 20:00 ~ 2022-04-22 21:00",
        "hoster": "Lee Duck Go",
        "description": "for test",
    },
}

@app.route("/api/is_whitelisted", methods=["GET"])
@cross_origin()
def is_whitelisted():
    addr = request.args.get("addr", '')
    if addr.lower() in whitelist:
        return {"is_whitelisted": True, "data": {"meeting_info": whitelist[addr.lower()]}}
    return {"is_whitelisted": False, "data": {"apply_url": "https://www.baidu.com"}}

if __name__ == "__main__":
    app.run(host="localhost", port=8080)
