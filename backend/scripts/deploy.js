async function main() {
  const EvidenceRetention = await ethers.getContractFactory("EvidenceRetention");
  const evidenceRetention = await EvidenceRetention.deploy();

  await evidenceRetention.deployed();

  console.log("EvidenceRetention deployed to:", evidenceRetention.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 