import { Schema, Model, model } from "mongoose";

const CounterSchema = new Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  {
    versionKey: false,
  }
);

CounterSchema.static("increment", async function (counterName) {
  const count = await this.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return count.seq;
});

interface ICounterModel extends Model<any> {
  increment: (counterName: string) => Promise<number>;
}

const CounterModel: ICounterModel = model<any, ICounterModel>("Counter", CounterSchema);

export { CounterModel };
