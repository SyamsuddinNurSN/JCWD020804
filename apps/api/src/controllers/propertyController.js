import Property from '../models/property';
import Review from '../models/review';
import Room from '../models/room';
import User from '../models/user';

export const getAllProperty = async (req, res) => {
  try {
    const result = await Property.findAll();
    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: 'gagal mendapatkan data' });
  }
};

export const getPropertyById = async (req, res) => {
  try {
    const result = await Property.findOne({
      where: { id: req.params.id }, // Menambahkan kriteria pencarian berdasarkan ID Property
      include: [
        {
          model: Room,
          where: { PropertyId: req.params.id }, // Menambahkan kriteria pencarian berdasarkan ID Property
        },
      ],
    });

    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};

export const getReviewProperty = async (req, res) => {
  try {
    const { propertyName } = req.query;

    const whereCondition = {};
    if (propertyName) {
      whereCondition.name = propertyName;
    }

    const result = await Property.findAll({
      where: {
        userId: req.user.id,
        ...whereCondition,
      },
      include: [{ model: Review, include: [{ model: User }] }],
    });
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: error.message });
  }
};
