FROM python:3.7.4

ADD bot.py /
ADD config.json /
ADD google-app-credentials.json /
COPY requirements.txt /tmp
RUN pip3 install -r /tmp/requirements.txt

CMD ["python3", "-u", "./bot.py"]
