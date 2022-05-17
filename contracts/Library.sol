pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    string internal name;

    struct Book{
        string isbn;
        string title;
        string author;
    }
    Book[] internal bookStore;

    mapping(uint => address) internal ledge;

    constructor(string memory _name) {
        name = _name;
        bookStore.push(Book({
            isbn: "25092000",
            title: "league of legends",
            author: "riot"
        }));
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function addBook(string memory _isbn, string memory _title, string memory _author) public onlyOwner{
        bookStore.push(Book({
            isbn: _isbn,
            title: _title,
            author: _author
        }));
    }

    
}