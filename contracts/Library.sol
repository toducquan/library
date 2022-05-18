pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Library is Ownable {
    string internal name;

    struct Book {
        string isbn;
        string title;
        string author;
    }
    Book[] internal bookStore;

    event Borrow(address borrower, uint256 bookId);

    event ChangeName(string newName);

    mapping(uint256 => address) internal ledge;

    constructor(string memory _name) {
        name = _name;
        bookStore.push(
            Book({isbn: "25092000", title: "league of legends", author: "riot"})
        );
    }

    function getName() public view returns (string memory) {
        return name;
    }

    function setName(string memory _name) public {
        name = _name;
        emit ChangeName(_name);
    }

    function getListBook() public view returns (Book[] memory) {
        Book[] memory bookList = bookStore;
        return bookList;
    }

    function addBook(
        string memory _isbn,
        string memory _title,
        string memory _author
    ) public onlyOwner {
        bookStore.push(Book({isbn: _isbn, title: _title, author: _author}));
    }

    function getBookById(uint256 _bookId)
        public
        view
        returns (
            uint256 bookId,
            string memory isbn,
            string memory title,
            string memory author,
            address borrower
        )
    {
        Book memory book = bookStore[_bookId];
        bookId = _bookId;
        isbn = book.isbn;
        title = book.title;
        author = book.author;
        borrower = ledge[_bookId];
    }

    function isBorrowingBook(uint256 _bookId) public view returns (bool) {
        return ledge[_bookId] == msg.sender;
    }

    function isAvailable(uint256 _bookId) public view returns (bool) {
        return ledge[_bookId] == address(0);
    }

    modifier onlyBorrowable(uint256 _bookId) {
        require(isAvailable(_bookId), "this book isn't available");
        _;
    }

    function borrow(uint256 _bookId) public onlyBorrowable(_bookId) {
        ledge[_bookId] = msg.sender;
        emit Borrow(msg.sender, _bookId);
    }

    function takeBack(uint256 _bookId) public {
        require(isBorrowingBook(_bookId), "can only return borrowing book");
        ledge[_bookId] = address(0);
    }

    function getBookBorrowing() public view returns (Book[] memory) {
        Book[] memory borrowBook = new Book[](bookStore.length);
        uint256 j = 0;
        for (uint256 i = 0; i < bookStore.length; i++) {
            if (ledge[i] == msg.sender) {
                borrowBook[j] = bookStore[i];
                j++;
            }
        }
        return borrowBook;
    }
}
