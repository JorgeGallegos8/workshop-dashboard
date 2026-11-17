import bambulabs_api as bl
import requests
import time
from dotenv import dotenv_values
import signal
import sys

config = dotenv_values('.env')

ip = config['BAMBU_IP']
serial = config['BAMBU_SERIAL']
access_code = config['BAMBU_ACCESS_CODE']
backend_url = config['BACKEND_URL']

printer = bl.Printer(ip, access_code, serial)
printer.connect()
time.sleep(5) # Time to connect


def send_stats():
    try:
        readings = [
            {'device_id': 'bambu', 'metric': 'nozzle_temp', 'value': printer.get_nozzle_temperature(), 'unit': '°C'},
            {'device_id': 'bambu', 'metric': 'bed_temp', 'value': printer.get_bed_temperature(), 'unit': '°C'},
            {'device_id': 'bambu', 'metric': 'print_percentage', 'value': printer.get_percentage() or 0, 'unit': '%'},
        ]

        for reading in readings:
            requests.post(f'{backend_url}/api/readings', json=reading)

        print('Sent: ', readings)

    except Exception as e:
        print('Error sending stats: ', e)

def handle_exit(sig, frame):
    print('Shutting down...')
    printer.disconnect()
    sys.exit(0)

signal.signal(signal.SIGINT, handle_exit)

while True:
    send_stats()
    time.sleep(5)
