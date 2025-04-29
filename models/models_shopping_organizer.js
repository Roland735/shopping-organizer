// models_shopping_organizer.js
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/**
 * Item subdocument schema for items in a shopping list
 */
const ItemSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    unit: { type: String, default: '' },
    category: { type: String, default: '' },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    purchased: { type: Boolean, default: false },
    notes: { type: String, default: '' },
}, { _id: true });

/**
 * Shopping List schema
 */
const ShoppingListSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [ItemSchema],
    isShared: { type: Boolean, default: false },
    sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

/**
 * Expense tracking schema
 */
const ExpenseSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    date: { type: Date, default: Date.now },
    category: { type: String, default: '' },
    list: { type: Schema.Types.ObjectId, ref: 'ShoppingList' },
    itemName: { type: String },
    paymentMethod: { type: String, default: '' },
    notes: { type: String, default: '' },
}, { timestamps: true });

/**
 * Reminder schema for important purchases
 */
const ReminderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    recurring: {
        frequency: { type: String, enum: ['once', 'daily', 'weekly', 'monthly'], default: 'once' },
        interval: { type: Number, default: 1, min: 1 },
        // Ends after count occurrences or by endDate
        count: { type: Number, min: 1 },
        endDate: { type: Date },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        },
    },
    list: { type: Schema.Types.ObjectId, ref: 'ShoppingList' },
    itemName: { type: String },
    isCompleted: { type: Boolean, default: false },
}, { timestamps: true });

// Create geospatial index for location reminders
ReminderSchema.index({ location: '2dsphere' });



// Export models
export const ShoppingList = mongoose.models.ShoppingList || model('ShoppingList', ShoppingListSchema);
export const Expense = mongoose.models.Expense || model('Expense', ExpenseSchema);
export const Reminder = mongoose.models.Reminder || model('Reminder', ReminderSchema);
