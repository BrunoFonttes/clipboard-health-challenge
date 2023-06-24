const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256

const getCandidateFrom = ({ partitionKey }) => {
  let candidate = partitionKey
  if (typeof partitionKey !== "string") {
    candidate = JSON.stringify(partitionKey);
  }
  if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
    candidate = crypto.createHash("sha3-512").update(candidate).digest("hex");
  }
  return candidate
};

const deterministicPartitionKey = (event) => {
  if (event) {
    if (event.partitionKey) {
      return getCandidateFrom({ partitionKey: event.partitionKey })
    } else {
      const data = JSON.stringify(event);
      return crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }
  return TRIVIAL_PARTITION_KEY;

};

module.exports = { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH }