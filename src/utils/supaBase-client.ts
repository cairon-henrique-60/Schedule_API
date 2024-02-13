import { createClient } from '@supabase/supabase-js';

import { ENV_VARIABLES } from '../config/env.config';

import { BadRequestError } from '../http-exceptions/errors/types/BadRequestError';

const supabaseUrl = ENV_VARIABLES.SUPA_BASE_URL;
const supabaseKey = ENV_VARIABLES.SUPA_BASE_KEY;
const expireUrl = ENV_VARIABLES.SUPA_BASE_EXPIRING_URL;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});

async function uploadFileWithSignedUrl(originalname: string, buffer: Buffer) {
  const { data, error } = await supabase.storage
    .from('scheduleStorage')
    .upload(originalname, buffer, { upsert: true });

  if (error) {
    throw new BadRequestError(`Failed to upload the file! ${error.message}`);
  }

  const signedUrl = await supabase.storage
    .from('scheduleStorage')
    .createSignedUrl(originalname, +expireUrl);

  return { data, signedUrl: signedUrl.data.signedUrl };
}

export { supabase, uploadFileWithSignedUrl };
