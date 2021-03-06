
import Appointment from '../model/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

interface RequestDTO {
  provider_id: string;
  date: Date;
};

class CreateAppointmentService {

  public async execute({ date, provider_id }: RequestDTO): Promise<Appointment>{

    const appointmentsRepository = getCustomRepository(AppointmentsRepository)
    const appointmentDate = startOfHour(date); // CONVERTE HORA

    const findAppointmenteInSameDate = await appointmentsRepository.findBydate(appointmentDate);

    if(findAppointmenteInSameDate){
      throw Error('This appointment is already booked')
    }

    const appointment = appointmentsRepository.create({provider_id, date: appointmentDate});

    await appointmentsRepository.save(appointment);

    return appointment;
  }

}


export default CreateAppointmentService;
