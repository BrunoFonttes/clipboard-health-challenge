const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

const getsHashOf = (data)=> crypto.createHash("sha3-512").update(data).digest("hex");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns the string event.partitionKey", ()=>{
    const trivialKey = deterministicPartitionKey({partitionKey:"123"})
    expect(trivialKey).toBe("123")
  })
  it("Returns stringified event.partitionKey", ()=>{
    const obj = { value: 123}
    const trivialKey = deterministicPartitionKey({partitionKey:obj})
    expect(trivialKey).toBe(JSON.stringify(obj))
  })
  it("Returns hashed stringified event", ()=>{
    const event = { value: 123 }
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(getsHashOf(JSON.stringify(event)))
  })
  it("Returns hashed string event", ()=>{
    const event = "123469987745"
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(getsHashOf(JSON.stringify(event)))
  })
  it("Returns hashed event.partitionkey", ()=>{
    const event = { partitionKey: 'x'.repeat(256*10)  }
    console.log(event)
    const trivialKey = deterministicPartitionKey(event)
    expect(trivialKey).toBe(getsHashOf(event.partitionKey))
  })
  
});
