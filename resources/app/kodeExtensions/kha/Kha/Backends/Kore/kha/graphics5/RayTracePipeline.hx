package kha.graphics5;

#if kha_dxr

@:headerCode('
#include <Kore/pch.h>
#include <Kore/Graphics5/RayTrace.h>
')

@:cppFileCode('
#ifndef INCLUDED_haxe_io_Bytes
#include <haxe/io/Bytes.h>
#endif
')

@:headerClassCode("Kore::Graphics5::RayTracePipeline* pipeline;")
class RayTracePipeline {

	public function new(commandList: CommandList, rayShader: kha.Blob, hitShader: kha.Blob, missShader: kha.Blob, constantBuffer: ConstantBuffer) {
		untyped __cpp__("pipeline = new Kore::Graphics5::RayTracePipeline(commandList->commandList, rayShader->bytes->b->Pointer(), rayShader->get_length(), hitShader->bytes->b->Pointer(), hitShader->get_length(), missShader->bytes->b->Pointer(), missShader->get_length(), constantBuffer->buffer);");
	}
}

#end