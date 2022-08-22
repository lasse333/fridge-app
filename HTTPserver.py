from flask import Flask, make_response, send_file, request, redirect, abort
import os
import mimetypes

mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('application/javascript', '.mjs')
mimetypes.add_type('text/css', '.css')

app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
banned_paths = [".py"]


@app.errorhandler(404)
def page_not_found(e):
    return send_file("404.html"), 404

@app.route('/')
def home_page():
    resp = make_response(send_file("index.html"))
    return resp

@app.route('/<path:filename>')
def getfile(filename):

    for x in range(len(banned_paths)):
        if banned_paths[x] in filename:
            return abort(404), 404

    if filename[-1] == "/":

        if os.path.isfile("index.html"):

            return send_file("index.html")

        else:

            return abort(404), 404

    elif "." not in filename:

        if os.path.isfile("index.html"):

            return send_file("index.html")

        else:

            return abort(404), 404

    elif filename[-3:] == ".js":
        print("js")
        if os.path.isfile(filename):

            return send_file(filename, "application/javascript")

        else:

            return abort(404), 404
    
    else:

        if os.path.isfile(filename):

            return send_file(filename)

        else:

            return abort(404), 404



app.run(host='0.0.0.0', port=80, use_reloader=True)