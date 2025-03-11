import express from 'express'
import { getAllDevices, getDataDevice, getAllDevicesNoFilter } from '../controllers/deviceController.js'

const router = express.Router()

/**
 * @swagger
 * tags:
 *   - name: Devices
 *     description: Endpoints relacionados con los dispositivos de Akenza.
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Listado de workspace
 *     description: Realiza una petición para obtener todos los workspaces que tenemos en akenza.
 *     tags: [Devices]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autorización para acceder al endpoint (Formato Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: "${tokken}"
 *     responses:
 *       200:
 *         description: Lista de workspace obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Listado de workspace completo."
 *                 dataWorkspace:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "${idWorkspace}"
 *                           name:
 *                             type: string
 *                             example: "${nameWorkspace}"
 *       400:
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en la solicitud."
 */

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Dispositivos de un workspace
 *     description: Realiza una petición para obtener todos los dispositivos de un workspace.
 *     tags: [Devices]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Token de autorización para acceder al endpoint (Formato Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: "${tokken}"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workspaceIds:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "${idWorkspace}"
 *                     label:
 *                       type: string
 *                       example: "[opcional ${labelWorkspace}]"
 *     responses:
 *       200:
 *         description: Lista de dispositivos obtenida con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dispositivos obtenidos con éxito."
 *                 devices:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "${akenzaId}"
 *                           name:
 *                             type: string
 *                             example: "${nameAkenzaDevice}"
 *       400:
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en la solicitud."
 */

/**
 * @swagger
 * /api/devices/{akenzaId}:
 *   get:
 *     summary: Obtener detalles de un dispositivo
 *     description: Devuelve los detalles completos de un dispositivo por su ID definido en Akenza.
 *     tags: [Devices]
 *     parameters:
 *       - in: path
 *         name: akenzaId
 *         required: true
 *         description: akenzaId del dispositivo que se desea consultar.
 *         schema:
 *           type: string
 *           example: "${akenzaId}"
 *       - in: header
 *         name: Authorization
 *         description: Token de autorización para acceder al endpoint (Formato Bearer).
 *         required: true
 *         schema:
 *           type: string
 *           example: "${tokken}"
 *     responses:
 *       200:
 *         description: Detalles del dispositivo obtenidos con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Detalles del dispositivo completo."
 *                 dataDevice:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "${akenzaId}"
 *                     name:
 *                       type: string
 *                       example: "${nameAkenzaDevice}"
 *       400:
 *         description: Solicitud incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en la solicitud."
 *       401:
 *         description: No autorizado. Token de autorización faltante o inválido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No autorizado. Token de autorización requerido."
 */

router.post('/all-workspace', getAllDevicesNoFilter);

router.get('/:id', getDataDevice);

router.post('/', getAllDevices);

export default router