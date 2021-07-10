import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Project from '../models/projectModel.js';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const projectRouter = express.Router();

projectRouter.get('/', expressAsyncHandler(async(req, res) =>{
    const projects = await Project.find()
    res.send(projects);
}));

projectRouter.get(
    '/seed', 
    expressAsyncHandler(async(req, res) =>{
    // await Project.remove({});  
    const createdProjects = await Project.insertMany(data.projects);
    res.send({ createdProjects});
}));

projectRouter.get('/:id', expressAsyncHandler(async(req, res) =>{
    const project = await Project.findById(req.params.id);
    if(project){
        res.send(project);
    }else{
        res.status(404).send({ message: 'Project Not Found'});
    }
}));

projectRouter.post('/', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const project = new Project({
        
        brand: 'sample brand',
        model: 'sample model' + Date.now(),
        conversion: 'sample conversion',
        image:'/images/p1.jpg',
        owner:'sample description',

    });
    const createdProject = await project.save();
    res.send({message: 'Project Created Successfully', project: createdProject });
})
); 

projectRouter.put('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const project = await Project.findById(projectId);
    if(project){
       
        project.brand = req.body.brand;
        project.model = req.body.model;
        project.conversion = req.body.conversion;
        project.image = req.body.image;
        project.owner = req.body.owner;
        const updatedProject = await project.save();
        res.send({message:'Project Updated', project: updatedProject});

    }else{
        res.status(404).send({message:'Project Not Found'});
    }
}));

projectRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async(req, res) =>{
    const project = await Project.findById(req.params.id);
    if(project){
        const deleteProject = await project.remove();
        res.send({message: 'Project Deleted', project: deleteProject});
    }else{
        res.status(404).send({message: 'Project Not Found'});
    }
}));


export default projectRouter;