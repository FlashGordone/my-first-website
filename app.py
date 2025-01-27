from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Database setup
def init_db():
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS todos 
                 (id INTEGER PRIMARY KEY, title TEXT, description TEXT, deleted INTEGER DEFAULT 0)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/tasks', methods=['GET', 'POST'])
def tasks():
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    if request.method == 'POST':
        data = request.get_json()
        title, description = data['title'], data['description']
        c.execute("INSERT INTO todos (title, description) VALUES (?, ?)", (title, description))
        conn.commit()
        return jsonify({'message': 'Task added successfully!'})
    tasks = c.execute("SELECT * FROM todos").fetchall()
    conn.close()
    return jsonify(tasks)

@app.route('/delete/<int:task_id>', methods=['POST'])
def delete(task_id):
    conn = sqlite3.connect('todo.db')
    c = conn.cursor()
    c.execute("UPDATE todos SET deleted = 1 WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Task marked as deleted!'})

if __name__ == '__main__':
    app.run(debug=True)