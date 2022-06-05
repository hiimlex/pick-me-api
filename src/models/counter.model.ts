import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

counterSchema.static("increment", async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return count.seq;
});

interface ICounterModel extends mongoose.Model<any> {
  increment: (counterName: string) => Promise<number>;
}

const CounterModel = mongoose.model<any, ICounterModel>(
  "Counter",
  counterSchema
);

export { CounterModel };
