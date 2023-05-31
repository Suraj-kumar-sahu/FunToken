// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0 ;

contract FunToken{
    string public name = "FunToken";
    string public symbol = "FUN" ;
    string public standard = "FunToken V.0.1" ;
    uint public totalSupply ;
    uint public _userId ;
    address public ownerOfContract ;
    address[] public holderToken ;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    ) ;

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint _value
    ) ;

    struct TokenHolderInfo{
        uint _tokenId ;
        address _from;
        address _to ;
        uint _totalToken;
        bool _tokenHolder ;
    } 

    mapping(address => TokenHolderInfo) public tokenHolderInfos ;
    mapping(address => uint) public balanceOf ;
    mapping(address => mapping(address=>uint)) allowance ;

    constructor(uint _initialSupply)  {
        ownerOfContract = msg.sender ;
        balanceOf[ownerOfContract] = _initialSupply ;
        totalSupply = _initialSupply ;
    }

    function inc() internal {
        _userId += 1 ;
    }

    function transfer(address _to , uint _value) public returns(bool success){
        require(balanceOf[msg.sender] >= _value , "you don't have enough") ;
        inc() ;
        balanceOf[msg.sender] -= _value ;
        balanceOf[_to] += _value ;

        TokenHolderInfo storage tokenHolderInfo = tokenHolderInfos[_to] ;

        tokenHolderInfo._tokenId = _userId ;
        tokenHolderInfo._to = _to ;
        tokenHolderInfo._from = msg.sender ;
        tokenHolderInfo._tokenHolder = true ;
        tokenHolderInfo._totalToken = _value ;

        holderToken.push(_to) ;

        emit Transfer(msg.sender , _to , _value) ;

        return true ;
    }

    function approve(address _spender , uint _value) public returns(bool success){
        allowance[msg.sender][_spender] = _value ;

        emit Approval(msg.sender, _spender, _value);

        return true ;
    }

    function transferFrom(address _from , address _to , uint _value) public returns(bool success){
        balanceOf[_from] -= _value ;
        balanceOf[_to] += _value ;

        allowance[_from][_to] -= _value ;

        return true ;
    }

    function getTokenHolderData(address _address) public view returns(
        uint,
        address,
        address,
        uint,
        bool
    ){
        return(
            tokenHolderInfos[_address]._tokenId ,
            tokenHolderInfos[_address]._to ,
            tokenHolderInfos[_address]._from ,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder 
        ) ;
    } 

    function getTokenHolder() public view returns(address[] memory){
        return holderToken ;
    }

}