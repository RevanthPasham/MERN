import { Address } from "../db/models";
import type { AddressCreationAttributes } from "../db/models/address.model";
import { ADDRESS_TYPES } from "../db/models/address.model";

export interface AddressDto {
  id: string;
  fullName: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark: string | null;
  postalCode: string;
  addressType: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

function toDto(a: Address): AddressDto {
  return {
    id: a.id,
    fullName: a.fullName,
    phoneNumber: a.phoneNumber,
    country: a.country,
    state: a.state,
    city: a.city,
    area: a.area,
    streetAddress: a.streetAddress,
    landmark: a.landmark,
    postalCode: a.postalCode,
    addressType: a.addressType,
    isDefault: a.isDefault,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export async function listByUserId(userId: string): Promise<AddressDto[]> {
  const list = await Address.findAll({
    where: { userId },
    order: [
      ["isDefault", "DESC"],
      ["createdAt", "ASC"],
    ],
  });
  return list.map(toDto);
}

export async function getById(id: string, userId: string): Promise<AddressDto | null> {
  const a = await Address.findOne({ where: { id, userId } });
  return a ? toDto(a) : null;
}

export async function create(userId: string, body: Omit<AddressCreationAttributes, "userId">): Promise<AddressDto> {
  const addressType = ADDRESS_TYPES.includes(body.addressType as any) ? body.addressType : "Home";
  const isFirst = (await Address.count({ where: { userId } })) === 0;
  const isDefault = body.isDefault ?? isFirst;

  if (isDefault) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  const a = await Address.create({
    userId,
    fullName: body.fullName,
    phoneNumber: body.phoneNumber,
    country: body.country,
    state: body.state,
    city: body.city,
    area: body.area,
    streetAddress: body.streetAddress,
    landmark: body.landmark ?? null,
    postalCode: body.postalCode,
    addressType,
    isDefault,
  });
  return toDto(a);
}

export async function update(
  id: string,
  userId: string,
  body: Partial<Omit<AddressCreationAttributes, "userId" | "id">>
): Promise<AddressDto | null> {
  const a = await Address.findOne({ where: { id, userId } });
  if (!a) return null;

  if (body.addressType && !ADDRESS_TYPES.includes(body.addressType as any)) body.addressType = "Home";
  if (body.isDefault === true) {
    await Address.update({ isDefault: false }, { where: { userId } });
  }

  await a.update({
    ...(body.fullName !== undefined && { fullName: body.fullName }),
    ...(body.phoneNumber !== undefined && { phoneNumber: body.phoneNumber }),
    ...(body.country !== undefined && { country: body.country }),
    ...(body.state !== undefined && { state: body.state }),
    ...(body.city !== undefined && { city: body.city }),
    ...(body.area !== undefined && { area: body.area }),
    ...(body.streetAddress !== undefined && { streetAddress: body.streetAddress }),
    ...(body.landmark !== undefined && { landmark: body.landmark }),
    ...(body.postalCode !== undefined && { postalCode: body.postalCode }),
    ...(body.addressType !== undefined && { addressType: body.addressType }),
    ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
  });
  return toDto(a);
}

export async function setDefault(id: string, userId: string): Promise<AddressDto | null> {
  const a = await Address.findOne({ where: { id, userId } });
  if (!a) return null;
  await Address.update({ isDefault: false }, { where: { userId } });
  await a.update({ isDefault: true });
  return toDto(a);
}

export async function remove(id: string, userId: string): Promise<boolean> {
  const deleted = await Address.destroy({ where: { id, userId } });
  return deleted > 0;
}
