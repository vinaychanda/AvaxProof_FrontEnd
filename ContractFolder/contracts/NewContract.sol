// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract NewContract {

string public Greeting = "Hello ! welcome to Solidity";


function setGreeting(string memory _newGreeting) public {
Greeting= _newGreeting;
}

function getGreeting() public view returns (string memory) {
return Greeting;
}


}

