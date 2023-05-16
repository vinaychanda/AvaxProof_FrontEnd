import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [Greeting, setGreeting] = useState('');
  const [contractInstance, setContractInstance] = useState(null);
  const [newGreeting, setNewGreeting] = useState('');
 
  useEffect(() => {
    const connectToWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
          const abi =[
            {
              "inputs": [],
              "name": "Greeting",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getGreeting",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_newGreeting",
                  "type": "string"
                }
              ],
              "name": "setGreeting",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ];
          const contract = new web3.eth.Contract(abi, contractAddress);
          setContractInstance(contract);
        } catch (error) {
          console.log(`Failed to connect to wallet: ${error}`);
        }
      } else {
        console.log("MetaMask provider is not available, please install it.");
      }
    };
   connectToWallet();
  }, []);

  const handleGreetingChange = (event) => {
    const greet = event.target.value;
    setNewGreeting(greet);
  };

  const handleGreetingSubmit = async () => {
    await contractInstance.methods.setGreeting(newGreeting).send({ from: window.ethereum.selectedAddress });
    setGreeting(newGreeting);
    setNewGreeting('');
  };

    const handleGetGreeting = async () => {
      const greet = await contractInstance.methods.getGreeting().call();
      setGreeting(greet);
      };
      

  return (
    <div>
      <p>Current Greeting: {Greeting}</p>
      <input type="text" value={newGreeting} onChange={handleGreetingChange} />
      <button onClick={handleGreetingSubmit}>Change Greeting</button>
      <button onClick={handleGetGreeting}>GetGreeting</button>

    </div>
  );
}

export default App;
