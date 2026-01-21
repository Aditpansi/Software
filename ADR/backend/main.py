import serial, threading
from flask import Flask, request, jsonify

app = Flask(__name__)
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

latest = {}

def read_serial():
    while True:
        line = ser.readline().decode().strip()
        if line.startswith("POS"):
            _, axis, val = line.split(",")
            latest[axis] = float(val)

threading.Thread(target=read_serial, daemon=True).start()

@app.route("/set", methods=["POST"])
def set_position():
    axis = request.json["axis"]
    value = request.json["value"]
    ser.write(f"SET,{axis},{value}\n".encode())
    return jsonify(ok=True)

@app.route("/status")
def status():
    return jsonify(latest)

app.run(port=5000)
