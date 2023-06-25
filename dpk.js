const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256

const createHash = (candidate) => crypto
  .createHash("sha3-512")
  .update(candidate)
  .digest("hex");

const getStringCandidate = (partitionKey) => {
  if (typeof partitionKey !== "string") {
    return JSON.stringify(partitionKey)
  }
  return partitionKey
}

const getCandidateFrom = (partitionKey) => {
  const strCandidate = getStringCandidate(partitionKey)

  if (strCandidate.length > MAX_PARTITION_KEY_LENGTH) {
    return createHash(strCandidate)
  }
  return strCandidate;
};

const deterministicPartitionKey = (event) => {
  if (!event) {
    return TRIVIAL_PARTITION_KEY;
  }

  if (event.partitionKey) {
    return getCandidateFrom(event.partitionKey)
  }

  return createHash(JSON.stringify(event));
};

module.exports = {
  deterministicPartitionKey,
  createHash,
  MAX_PARTITION_KEY_LENGTH,
}