import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({

    brand:{ type: String, required: true},
    model: {type: String, required: true},
    conversion: { type: String, required: true},
    image: { type: String, required: true},
    owner: { type: String, required: true},
    
},
{
    timestamps: true,
});

const Project = mongoose.model('project', projectSchema);

export default Project;