const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256

const getCandidateFrom = ({partitionKey}) => {
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
  let candidate;

  if (event) {
    if (event.partitionKey) {
      candidate = getCandidateFrom({partitionKey:event.partitionKey})
    } else {
      const data = JSON.stringify(event);
      candidate = crypto.createHash("sha3-512").update(data).digest("hex");
    }
  }
  else {
    candidate = TRIVIAL_PARTITION_KEY;
  }

  return candidate;
};

module.exports = { deterministicPartitionKey, MAX_PARTITION_KEY_LENGTH }