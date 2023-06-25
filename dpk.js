const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256

const createHash = (candidate) => crypto
  .createHash("sha3-512")
  .update(candidate)
  .digest("hex");


const getCandidateFrom = ({ partitionKey }) => {
  let candidate = partitionKey
  if (typeof partitionKey !== "string") {
    candidate = JSON.stringify(partitionKey);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = createHash(candidate);
  }
  return candidate
};

const deterministicPartitionKey = (event) => {
  if (event) {
    if (event.partitionKey) {
      return getCandidateFrom({ partitionKey: event.partitionKey })
    } else {
      return createHash(JSON.stringify(event));
    }
  }
  return TRIVIAL_PARTITION_KEY;
};

module.exports = { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH }