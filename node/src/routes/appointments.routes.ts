import { Router } from 'express';
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensoreAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (request, response) => {

  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();

  return response.json(appointments);
});

appointmentsRouter.post('/', async (request, response) => {

  try {
    const { provider_id, date} = request.body;

    const parseDate = parseISO(date)

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({ date: parseDate, provider_id })

    response.json(appointment);
  } catch(err) {
    return response.status(400).json({ error : err.message });
  }

});

export default appointmentsRouter;

