// client/src/sanity/client.js
import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'qmqcpnth',  // 🔁 Replace with your actual project ID
  dataset: 'production',         // or your dataset name
  apiVersion: '2023-05-03',      // any recent date
  useCdn: false,
  token: 'skW7qlftoXAtpvKQdEoeeIhwzMJbjlsjNVYaeKWWOKhIYcZKbSiCMXIsZhefB2zrle6Uqzyi8G1Hsyv3pB3WcnVbmd1iFovKUwfqSs9ZFo85u6vjQpm3tawGlMGpoxDwJJXRnTy7U98r8LJpMpi45CCZ7v65XrJw2AWGFBzfVlWcSzcgv5Xe'
});
