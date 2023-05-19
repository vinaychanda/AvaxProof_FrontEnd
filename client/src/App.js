import React, { useState, useEffect } from 'react';
import Web3 from 'web3';



const web3 = new Web3(Web3.givenProvider);

function App() {
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    async function initialize() {
      try {
        // Load the smart contract
        const networkId = await web3.eth.net.getId();
        const contractData = require('./contracts/TodoList.json');
        const deployedNetwork = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const todoList = new web3.eth.Contract(
          contractData.abi,
          deployedNetwork
        );
        setContract(todoList);

        // Get the user's account
        const accounts = await web3.eth.requestAccounts();
        setAccount(accounts[0]);

        // Fetch existing tasks
        const totalTasks = await todoList.methods.taskCount().call();
        const fetchedTasks = [];
        for (let i = 1; i <= totalTasks; i++) {
          const task = await todoList.methods.tasks(i).call();
          fetchedTasks.push(task);
        }
        setTasks(fetchedTasks);
      } catch (error) {
        console.error('Error:', error);
      }
    }

    initialize();
  }, []);

  async function createTask(content) {
    await contract.methods.createTask(content).send({ from: account });
    const newTask = await contract.methods.tasks(tasks.length + 1).call();
    setTasks([...tasks, newTask]);
  }

  async function completeTask(taskId) {
    await contract.methods.completeTask(taskId).send({ from: account });
    const updatedTasks = [...tasks];
    updatedTasks[taskId - 1].completed = true;
    setTasks(updatedTasks);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List</h1>
        {account ? (
          <p>Connected Account: {account}</p>
        ) : (
          <button onClick={() => web3.eth.requestAccounts()}>
            Connect to Wallet
          </button>
        )}
      </header>
      <div className="task-list">
        <h2>Tasks:</h2>
        {tasks.map(task => (
          <div
            key={task.id}
            className={`task ${task.completed ? 'completed' : ''}`}
          >
            <p>{task.content}</p>
            {!task.completed && (
              <button onClick={() => completeTask(task.id)}>
                Complete
              </button>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={e => {
          e.preventDefault();
          const content = e.target.elements.content.value;
          createTask(content);
          e.target.reset();
        }}
      >
        <input type="text" name="content" placeholder="Task content" />
        <button type="submit">Add Task</button>
      </form>

      

    </div>
  );
}

export default App;
