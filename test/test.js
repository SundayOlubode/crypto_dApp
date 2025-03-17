const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleToken", function () {
  let SimpleToken;
  let simpleToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    SimpleToken = await ethers.getContractFactory("SimpleToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    simpleToken = await SimpleToken.deploy(
      "Simple Token",
      "SIM",
      18,
      1000000, // 1 million tokens
    );

    await simpleToken.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      // The deployer should have all tokens initially
      const ownerBalance = await simpleToken.balanceOf(owner.address);
      expect(await simpleToken.totalSupply()).to.equal(ownerBalance);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await simpleToken.balanceOf(owner.address);
      expect(ownerBalance).to.equal(ethers.utils.parseEther("1000000"));
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await simpleToken.transfer(addr1.address, ethers.utils.parseEther("50"));
      const addr1Balance = await simpleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther("50"));

      // Transfer 50 tokens from addr1 to addr2
      await simpleToken
        .connect(addr1)
        .transfer(addr2.address, ethers.utils.parseEther("50"));
      const addr2Balance = await simpleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.utils.parseEther("50"));
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      // Get initial balances
      const initialOwnerBalance = await simpleToken.balanceOf(owner.address);

      // Try to send more tokens than available
      await expect(
        simpleToken.connect(addr1).transfer(owner.address, 1),
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed
      expect(await simpleToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance,
      );
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await simpleToken.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1
      await simpleToken.transfer(addr1.address, ethers.utils.parseEther("100"));

      // Transfer 50 tokens from addr1 to addr2
      await simpleToken
        .connect(addr1)
        .transfer(addr2.address, ethers.utils.parseEther("50"));

      // Check balances
      const finalOwnerBalance = await simpleToken.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.sub(ethers.utils.parseEther("100")),
      );

      const addr1Balance = await simpleToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther("50"));

      const addr2Balance = await simpleToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.utils.parseEther("50"));
    });
  });
});
