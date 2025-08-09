from dotenv import load_dotenv
import subprocess
import time
import os

load_dotenv()

wallet_address = os.getenv('WALLET')
package_id = os.getenv('PACKAGE')

interval = int(input('Call frequency? (in minutes, default 60) : '))
while True:
    subprocess.call(['sui', 'client', 'call', '--function', 'globalTimedTasks', '--args', wallet_address, '--module', 'bidding', '--package', package_id])
    print(f'last executed at : {time.strftime('%m/%d/%Y, %H:%M:%S', time.localtime())} with {interval} minute interval')
    time.sleep(interval * 60)