const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256

const createHash = (candidate) => crypto
  .createHash("sha3-512")
  .update(candidate)
  .digest("hex");


const getCandidateFrom = (partitionKey) => {
  const candidate = typeof partitionKey !== "string" ?
    JSON.stringify(partitionKey) : partitionKey

  return candidate.length > MAX_PARTITION_KEY_LENGTH ?
    createHash(candidate) : candidate;
};

const deterministicPartitionKey = (event) => {
  if (event) {
    return event.partitionKey ?
      getCandidateFrom(event.partitionKey) :
      createHash(JSON.stringify(event));
  }
  return TRIVIAL_PARTITION_KEY;
};

module.exports = { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH }