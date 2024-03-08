import LightingNode from './LightingNode.js';
import { cache } from '../core/CacheNode.js';
import { context } from '../core/ContextNode.js';
import { roughness, clearcoatRoughness } from '../core/PropertyNode.js';
import { cameraViewMatrix } from '../accessors/CameraNode.js';
import { transformedClearcoatNormalView, transformedNormalView, transformedNormalWorld } from '../accessors/NormalNode.js';
import { positionViewDirection } from '../accessors/PositionNode.js';
import { addNodeClass } from '../core/Node.js';
import { float } from '../shadernode/ShaderNode.js';
import { reference } from '../accessors/ReferenceNode.js';
import { pmremTexture } from '../pmrem/PMREMNode.js';

const envNodeCache = new WeakMap();

class EnvironmentNode extends LightingNode {

	constructor( envNode = null ) {

		super();

		this.envNode = envNode;

	}

	setup( builder ) {

		let envNode = this.envNode;

		if ( envNode.isTextureNode ) {

			let cacheEnvNode = envNodeCache.get( envNode.value );

			if ( cacheEnvNode === undefined ) {

				cacheEnvNode = pmremTexture( envNode.value );

				envNodeCache.set( envNode.value, cacheEnvNode );

			}

			envNode	= cacheEnvNode;

		}

		//

		const intensity = reference( 'envMapIntensity', 'float', builder.material ); // @TODO: Add materialEnvIntensity in MaterialNode

		const radiance = context( envNode, createRadianceContext( roughness, transformedNormalView ) ).mul( intensity );
		const irradiance = context( envNode, createIrradianceContext( transformedNormalWorld ) ).mul( Math.PI ).mul( intensity );

		const isolateRadiance = cache( radiance );

		//

		builder.context.radiance.addAssign( isolateRadiance );

		builder.context.iblIrradiance.addAssign( irradiance );

		//

		const clearcoatRadiance = builder.context.lightingModel.clearcoatRadiance;

		if ( clearcoatRadiance ) {

			const clearcoatRadianceContext = context( envNode, createRadianceContext( clearcoatRoughness, transformedClearcoatNormalView ) ).mul( intensity );
			const isolateClearcoatRadiance = cache( clearcoatRadianceContext );

			clearcoatRadiance.addAssign( isolateClearcoatRadiance );

		}

	}

}

const createRadianceContext = ( roughnessNode, normalViewNode ) => {

	let reflectVec = null;

	return {
		getUV: () => {

			if ( reflectVec === null ) {

				reflectVec = positionViewDirection.negate().reflect( normalViewNode );
				reflectVec = roughnessNode.mul( roughnessNode ).mix( reflectVec, normalViewNode ).normalize();
				reflectVec = reflectVec.transformDirection( cameraViewMatrix );

			}

			return reflectVec;

		},
		getTextureLevel: () => {

			return roughnessNode;

		}
	};

};

const createIrradianceContext = ( normalWorldNode ) => {

	return {
		getUV: () => {

			return normalWorldNode;

		},
		getTextureLevel: () => {

			return float( 1.0 );

		}
	};

};

export default EnvironmentNode;

addNodeClass( 'EnvironmentNode', EnvironmentNode );
