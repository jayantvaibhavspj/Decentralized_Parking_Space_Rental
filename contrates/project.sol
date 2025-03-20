// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParkingRental {
    struct ParkingSpace {
        uint256 id;
        address payable owner;
        string location;
        uint256 pricePerHour;
        bool isAvailable;
    }

    mapping(uint256 => ParkingSpace) public parkingSpaces;
    uint256 public nextSpaceId;
    
    event ParkingSpaceListed(uint256 id, address owner, string location, uint256 pricePerHour);
    event ParkingSpaceRented(uint256 id, address renter, uint256 hoursRented, uint256 totalPrice);

    function listParkingSpace(string memory location, uint256 pricePerHour) public {
        parkingSpaces[nextSpaceId] = ParkingSpace(nextSpaceId, payable(msg.sender), location, pricePerHour, true);
        emit ParkingSpaceListed(nextSpaceId, msg.sender, location, pricePerHour);
        nextSpaceId++;
    }

    function rentParkingSpace(uint256 spaceId, uint256 hoursRented) public payable {
        ParkingSpace storage space = parkingSpaces[spaceId];
        require(space.isAvailable, "Parking space not available");
        uint256 totalPrice = space.pricePerHour * hoursRented;
        require(msg.value >= totalPrice, "Insufficient payment");

        space.owner.transfer(msg.value);
        space.isAvailable = false;
        
        emit ParkingSpaceRented(spaceId, msg.sender, hoursRented, totalPrice);
    }
}
