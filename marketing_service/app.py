
from flask import Flask, render_template, request, redirect, url_for, flash
import os

app = Flask(__name__, template_folder="ui/templates")
app.secret_key = os.environ.get('SECRET_KEY', 'dev')

# In-memory storage for demo; replace with DB in production
leads = []

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip()
    if not name or not email:
        flash('Please fill in all fields.', 'error')
        return redirect(url_for('index'))
    # Add to in-memory list (simulate DB auto-increment id)
    lead_id = len(leads) + 1
    leads.append({'id': lead_id, 'name': name, 'email': email})
    flash('Lead submitted successfully!', 'success')
    return redirect(url_for('index'))

@app.route('/show-data', methods=['GET'])
def show_data():
    return render_template('show_data.html', leads=leads)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)