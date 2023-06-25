const {
  deterministicPartitionKey,
  createHash,
  MAX_PARTITION_KEY_LENGTH,
} = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns the string event.partitionKey", () => {
    const trivialKey = deterministicPartitionKey({ partitionKey: "123" })
    expect(trivialKey).toBe("123")
  })
  it("Returns stringified event.partitionKey", () => {
    const obj = { value: 123 }
    const trivialKey = deterministicPartitionKey({ partitionKey: obj })
    expect(trivialKey).toBe(JSON.stringify(obj))
  })
  it("Returns hashed stringified event", () => {
    const event = { value: 123 }
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(createHash(JSON.stringify(event)))
  })
  it("Returns hashed string event", () => {
    const event = "123469987745"
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(createHash(JSON.stringify(event)))
  })
  it("Returns hashed event.partitionkey", () => {
    const event = { partitionKey: 'x'.repeat(MAX_PARTITION_KEY_LENGTH * 10) }
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(createHash(event.partitionKey))
  })

});
