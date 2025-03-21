const contractAddress = "0x1b9EA618f4D04eE3A173B883aBD27EeF44101c26";
const contractABI = [ [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerHour",
				"type": "uint256"
			}
		],
		"name": "ParkingSpaceListed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "renter",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "hoursRented",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			}
		],
		"name": "ParkingSpaceRented",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "pricePerHour",
				"type": "uint256"
			}
		],
		"name": "listParkingSpace",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nextSpaceId",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "parkingSpaces",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "pricePerHour",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isAvailable",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "spaceId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hoursRented",
				"type": "uint256"
			}
		],
		"name": "rentParkingSpace",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	}
] ];

let web3;
let contract;

async function connectWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        contract = new web3.eth.Contract(contractABI, contractAddress);
    } else {
        alert("Please install MetaMask to use this DApp.");
    }
}

async function listParkingSpace() {
    const location = document.getElementById("location").value;
    const price = document.getElementById("price").value;
    const accounts = await web3.eth.getAccounts();

    await contract.methods.listParkingSpace(location, web3.utils.toWei(price, "ether"))
        .send({ from: accounts[0] });

    alert("Parking space listed successfully!");
}

async function rentParkingSpace() {
    const spaceId = document.getElementById("spaceId").value;
    const hours = document.getElementById("hours").value;
    const accounts = await web3.eth.getAccounts();
    
    const space = await contract.methods.parkingSpaces(spaceId).call();
    const price = web3.utils.toWei((space.pricePerHour * hours).toString(), "ether");

    await contract.methods.rentParkingSpace(spaceId, hours)
        .send({ from: accounts[0], value: price });

    alert("Parking space rented successfully!");
}

async function loadParkingSpaces() {
    let listElement = document.getElementById("parkingList");
    listElement.innerHTML = "";

    const spacesCount = await contract.methods.nextSpaceId().call();
    
    for (let i = 0; i < spacesCount; i++) {
        const space = await contract.methods.parkingSpaces(i).call();
        if (space.isAvailable) {
            let item = document.createElement("li");
            item.textContent = `ID: ${space.id}, Location: ${space.location}, Price: ${web3.utils.fromWei(space.pricePerHour, "ether")} ETH/hour`;
            listElement.appendChild(item);
        }
    }
}

window.onload = connectWeb3;
