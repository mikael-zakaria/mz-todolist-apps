document.addEventListener('DOMContentLoaded', function () {

    const todos = [];
    const RENDER_EVENT = 'render-todo';

    const submitForm = document.getElementById('form');

    // Fungsi generateId() berfungsi untuk menghasilkan identitas unik pada setiap item todo. 
    function generateId() {
        
        // Untuk menghasilkan identitas yang unik, 
        // kita manfaatkan +new Date() untuk mendapatkan timestamp pada JavaScript.
        return +new Date();
    }
       
    // Berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan (parameter function), 
    // diantaranya id, nama todo (task), waktu (timestamp), dan 
    // isCompleted (penanda todo apakah sudah selesai atau belum).
    function generateTodoObject(id, task, timestamp, isCompleted) {
        
        return {
          id,
          task,
          timestamp,
          isCompleted
        }
    }
    
    function addTodo() {
        // Ambil Nilai
        const textTodo = document.getElementById('title').value;
        const timestamp = document.getElementById('date').value;
        const generatedID = generateId();

        // Membuat sebuah object dari todo dengan memanggil helper generateTodoObject() untuk membuat object baru
        const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
        
        // console.log(typeof(todoObject));

        // System. exit(1);

        // Object tersebut disimpan pada array todos menggunakan metode push().
        todos.push(todoObject);
       
        // Setelah disimpan pada array, kita panggil sebuah custom event RENDER_EVENT menggunakan method dispatchEvent(). 
        // Custom event ini akan kita terapkan untuk me-render data yang telah disimpan pada array todos.
        document.dispatchEvent(new Event(RENDER_EVENT)); // Dispatch digunakan untuk mentrigger event
    }

    submitForm.addEventListener('submit', function (event) {
        
        //Ketika kita melakukan proses submit pada form, halaman web akan melakukan proses refresh. 
        //Nah, event.preventDefault() akan mencegah proses refresh tersebut.
        event.preventDefault();
        
        addTodo();
    });


    function makeTodo(todoObject) {
        const textTitle = document.createElement('h2');
        textTitle.innerText = todoObject.task;
       
        const textTimestamp = document.createElement('p');
        textTimestamp.innerText = todoObject.timestamp;
       
        const textContainer = document.createElement('div');
        textContainer.classList.add('inner');
        textContainer.append(textTitle, textTimestamp);
       
        const container = document.createElement('div');
        container.classList.add('item', 'shadow');
        container.append(textContainer);
        container.setAttribute('id', `todo-${todoObject.id}`);

        // Kedua
        if (todoObject.isCompleted) {
          const undoButton = document.createElement('button');
          undoButton.classList.add('undo-button');
       
          undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
          });
       
          const trashButton = document.createElement('button');
          trashButton.classList.add('trash-button');
       
          trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
          });
        
          container.append(undoButton, trashButton);
        
        } else {
        
          const checkButton = document.createElement('button');
          checkButton.classList.add('check-button');
          
          checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
          });
          
          container.append(checkButton);
        }
       
        // Mengembalikan Tampilan HTML
        return container;
      }
      
      // Fungsi untuk merubah to do list menjadi selesai
      function addTaskToCompleted (todoId) {

        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
      }

      // Digunakan untuk merubah nilai isCompleted 
      function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);
       
        if (todoTarget == null) return;
       
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
      }

      // Fungsi untuk mencari 1 objek yg ada pada array dari todos
      function findTodo(todoId) {
        
        for (const todoItem of todos) {

          if (todoItem.id === todoId) {
            return todoItem;
          }

        }
        
        return null;
      }

      // Digunakan Untuk Menghapus Objek dari Array todos
      function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);
       
        if (todoTarget === -1) return;
       
        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
      }
      
      
      // Digunakan Untuk Mencari Nilai dari index objek pada array
      function findTodoIndex(todoId) {
        for (const index in todos) {
          
          if (todos[index].id === todoId) {
            return index;
          }

        }
       
        return -1;
      }  

      


    // Semua fungsi yang dibutuhkan sudah selesai ditulis. Untuk memastikan bahwa fungsi diatas bisa berhasil, 
    // kita perlu membuat listener dari RENDER_EVENT, dengan menampilkan array todos menggunakan console.log().
    document.addEventListener(RENDER_EVENT, function () {
        //console.log(todos);
        
        const uncompletedTODOList = document.getElementById('todos');
        uncompletedTODOList.innerHTML = '';
       
        const completedTODOList = document.getElementById('completed-todos');
        completedTODOList.innerHTML = '';

        for (const todoItem of todos) {
          
          // todoElement berisi html DOM
          const todoElement = makeTodo(todoItem);

          if (!todoItem.isCompleted) {
            uncompletedTODOList.append(todoElement);
          } else {
            completedTODOList.append(todoElement);
          }

        }

      });

});